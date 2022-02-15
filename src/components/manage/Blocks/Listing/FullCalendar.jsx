import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import allLocales from '@fullcalendar/core/locales-all';
import { flattenToAppURL } from '@plone/volto/helpers';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import { RRule, rrulestr } from 'rrule';

/* returns all events, computed by the reccurence rule of an Event item */
const expand = (item) => {
  let recurrence = item.recurrence;
  if (item.recurrence.indexOf('DTSTART') < 0) {
    var dtstart = RRule.optionsToString({
      dtstart: new Date(item.start),
    });
    recurrence = dtstart + '\n' + recurrence;
  }

  const rrule = rrulestr(recurrence, { unfold: true, forceset: true });

  return rrule.all().map((date) => {
    /* rrule.all() only gives us dates, so we add time part of
       our original event: item.start (`2022-03-01T09:00:00+00:00`) */
    let dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    let startStr = dateStr + item.start.slice(10);
    let endStr = dateStr + item.end.slice(10);
    /* and return full object for FullCalendar */
    return {
      title: item.title,
      start: startStr,
      end: endStr,
      url: flattenToAppURL(item['@id']),
      groupId: item['@id'],
    };
  });
};

const FullCalendarListing = ({ items, moment: momentlib }) => {
  const intl = useIntl();

  const moment = momentlib.default;
  moment.locale(intl.locale);

  /* server-side rendering with FullCalendar does not work here,
     so we need to render after client-side hydration - as described here:
     https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
  */
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  let recurrences = [];

  const isFullDayEvent = (event) => {
    let start = new Date(event.start);
    let end = new Date(event.end);
    return (
      start.getHours() === 0 &&
      start.getMinutes() === 0 &&
      end.getHours() === 23 &&
      end.getMinutes() === 59
    );
  };

  let events = items
    .filter((i) => {
      if (i['@type'] !== 'Event') return false;
      if (i.recurrence) {
        recurrences = recurrences.concat(expand(i));
        /* expand returns initial event as well, so we skip it here */
        return false;
      }
      return true;
    })
    .map((i) => {
      return {
        title: i.title,
        start: i.start,
        end: i.end,
        url: flattenToAppURL(i['@id']),
      };
    });

  events = events.concat(recurrences);

  events = events.map((event) => {
    console.log(event);
    if (isFullDayEvent(event)) {
      event.start = event.start.slice(0, 10);
      delete event.end;
    }
    return event;
  });

  const fcOptions = {
    plugins: [dayGridPlugin, listPlugin, timeGridPlugin],
    buttonText: {
      listWeek: 'List week',
      listMonth: 'List month',
    },
    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'listWeek,listMonth',
      right: 'prev,next today',
    },
    initialView: 'dayGridMonth',
    locales: allLocales,
    locale: intl.locale ?? 'en',
  };

  return isClientSide && <FullCalendar events={events} {...fcOptions} />;
};

export default injectLazyLibs(['moment'])(FullCalendarListing);
