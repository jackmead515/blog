export const data = {
  baseUrl: 'https://www.speblog.org',
  captchaId: '6LcF6D4UAAAAAPpfXZfE5SjkgDFvHWM1lhq-LEGa',
  blogTitle: 'Self Proclaimed Engineer\'s Blog | Programming, Electronics, and Life',
  blogDescription: 'Blog on my quirks in engineering. Topics on programming in Rust, Python, Javascript, Node, Java and fidgeting with electronic circuits and microcontrollers.',
  blogKeywords: 'java,rust,python,javascript,node,electronics,circuits,microcontroller',
};

export function getBaseUrl() {
  const dev = process.env.NODE_ENV === 'development' ? true : false;
  if (dev) {
    return 'http://127.0.0.1:5000';
  }

  return 'https://www.speblog.org';
}

export function initialize() {
  const dev = process.env.NODE_ENV === 'development' ? true : false;

  if (dev) {
    data.baseUrl = 'http://127.0.0.1:5000';
    data.captchaId = '6LfLP8oUAAAAAH8VDo8CT_hiXT0e22L0rE9ax0Ez';
  }
}