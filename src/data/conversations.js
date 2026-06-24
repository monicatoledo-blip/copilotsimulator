export const conversations = [
  {
    id: 'wandasHub',
    name: "Wanda's Sales Hub",
    isChannel: true,
    avatar: 'WA',
    avatarColor: '#7B83EB',
    preview: 'Updates on sales forecasting and pipeline performance.',
    time: '9:15 AM',
    messages: [
      { sender: 'Wanda', time: '9:15 AM', text: 'Updated the pipeline report for Q2 — we need to discuss the Enterprise West changes before the leadership sync.' },
      { sender: 'You', time: '9:16 AM', text: 'Got it, I\'ll pull up the latest numbers now.' },
    ]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    isChannel: true,
    avatar: 'SF',
    avatarColor: '#00A1E0',
    avatarImg: true,
    preview: "Welcome! I'm your Salesforce assistant.",
    time: '9:00 AM',
    messages: [
      {
        sender: 'Salesforce',
        time: '5:29 PM',
        isBot: true,
        text: "Hi Marie, here's your weekly data digest.",
        richCard: 'analyticsInsight'
      }
    ]
  },
  {
    id: 'wanda',
    name: 'Wanda',
    avatar: 'WA',
    avatarColor: '#7B83EB',
    preview: 'Can you review the at-risk card?',
    time: '10:12 AM',
    messages: [
      { sender: 'Wanda', time: '10:12 AM', text: 'Can you review the at-risk card before leadership sync?' },
      { sender: 'You', time: '10:13 AM', text: "Yep, I'll check it now and post highlights in 10 mins." },
      { sender: 'Wanda', time: '10:14 AM', text: 'Perfect, especially call out Enterprise West changes.' },
    ]
  },
  {
    id: 'raj',
    name: 'Raj Tanaka',
    avatar: 'RA',
    avatarColor: '#C4314B',
    preview: 'Sounds good, I will update the deck.',
    time: '1:47 PM',
    messages: [
      { sender: 'Raj Tanaka', time: '1:45 PM', text: 'Did you get a chance to review the forecast slides?' },
      { sender: 'You', time: '1:46 PM', text: 'Yes, looks great. Just need to update the at-risk section.' },
      { sender: 'Raj Tanaka', time: '1:47 PM', text: 'Sounds good, I will update the deck.' },
    ]
  },
  {
    id: 'beth',
    name: 'Beth Davies',
    avatar: 'BE',
    avatarColor: '#E97548',
    preview: 'Can we sync tomorrow morning?',
    time: '1:43 PM',
    messages: [
      { sender: 'Beth Davies', time: '1:43 PM', text: 'Can we sync tomorrow morning?' },
    ]
  },
  {
    id: 'kayo',
    name: 'Kayo Miwa',
    avatar: 'KA',
    avatarColor: '#4F6BED',
    preview: 'Thanks for the quick turnaround!',
    time: 'Yesterday',
    messages: [
      { sender: 'Kayo Miwa', time: 'Yesterday', text: 'Thanks for the quick turnaround!' },
    ]
  },
  {
    id: 'group',
    name: 'Will, Kayo, Eric, +2',
    avatar: 'WI',
    avatarColor: '#2D9F4F',
    preview: 'Shared July_Promotion.xlsx',
    time: '12:00 PM',
    messages: []
  },
  {
    id: 'marie',
    name: 'Marie Beaudoin',
    avatar: 'MA',
    avatarColor: '#B4009E',
    preview: 'Tableau metric card attached below',
    time: '1:00 PM',
    messages: []
  },
]
