describe('background', () => {
  let background;
  const setup = (url = 'https://github.com/xxhomey19/github-file-icon') => {
    global.chrome = {
      webNavigation: {
        onHistoryStateUpdated: {
          addListener: jest.fn(fn => {
            fn({
              url,
            });
          }),
        },
      },
      tabs: {
        executeScript: jest.fn(),
      },
    };
    // eslint-disable-next-line global-require
    background = require('../background');
  };
  beforeEach(() => {
    jest.resetModules();
  });

  it('should exist', () => {
    setup();
    expect(background).toBeDefined();
  });

  it('should call addListener and executeScript', () => {
    setup();
    expect(chrome.webNavigation.onHistoryStateUpdated.addListener).toBeCalled();
    expect(chrome.tabs.executeScript).toBeCalledWith(null, {
      file: 'contentscript.bundle.js',
    });
  });

  it('should not executeScript if url is not GitHub', () => {
    setup('https://www.google.com.tw');
    expect(chrome.tabs.executeScript).not.toBeCalled();
  });
});
