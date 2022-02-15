import messages from './messages.js';

const getToolbarChoices = (intl) => {
  return [
    ['dayGridMonth', intl.formatMessage(messages.labelDayGridMonth)],
    ['timeGridWeek', intl.formatMessage(messages.labelTimeGridWeek)],
    ['timeGridDay', intl.formatMessage(messages.labelTimeGridDay)],
    ['listMonth', intl.formatMessage(messages.labelListMonth)],
    ['listWeek', intl.formatMessage(messages.labelListWeek)],
    ['listDay', intl.formatMessage(messages.labelListDay)],
    ['next', intl.formatMessage(messages.labelNext)],
    ['prev', intl.formatMessage(messages.lebelPrev)],
    ['today', intl.formatMessage(messages.labelToday)],
  ];
};

const FullCalendarBlockSchema = (intl) => {
  return {
    title: intl.formatMessage(messages.labelCalendarSettings),

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'calendar_url',
          'toolbar_left',
          'toolbar_center',
          'toolbar_right',
        ],
      },
    ],

    properties: {
      calendar_url: {
        title: intl.formatMessage(messages.labelCalendarURL),
        description: intl.formatMessage(messages.descriptionCalendarURL),
        type: 'string',
      },
      toolbar_left: {
        title: intl.formatMessage(messages.labelToolbarLeft),
        type: 'string',
        factory: 'Choice',
        choices: getToolbarChoices(intl),
        isMulti: true,
        initialValue: ['dayGridMonth', 'timeGridWeek', 'timeGridDay'],
      },
      toolbar_center: {
        title: intl.formatMessage(messages.labelToolbarCenter),
        type: 'string',
        factory: 'Choice',
        choices: getToolbarChoices(intl),
        isMulti: true,
        initialValue: ['listMonth', 'listWeek', 'listDay'],
      },
      toolbar_right: {
        title: intl.formatMessage(messages.labelToolbarRight),
        type: 'string',
        factory: 'Choice',
        choices: getToolbarChoices(intl),
        isMulti: true,
        initialValue: ['prev', 'today', 'next'],
      },
    },

    required: [],
  };
};

export default FullCalendarBlockSchema;
