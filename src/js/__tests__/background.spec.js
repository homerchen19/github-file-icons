describe('background', () => {
  let background;
  beforeEach(() => {
    jest.resetModules();
    global.chrome = {
      webNavigation: {
        onHistoryStateUpdated: {
          addListener: jest.fn(fn => {
            fn();
          }),
        },
      },
      tabs: {
        executeScript: jest.fn(),
      },
    };
    // eslint-disable-next-line global-require
    background = require('../background');
  });

  it('should exist', () => {
    expect(background).toBeDefined();
  });

  it('should call addListener and executeScript', () => {
    expect(chrome.webNavigation.onHistoryStateUpdated.addListener).toBeCalled();
    expect(chrome.tabs.executeScript).toBeCalledWith(null, {
      file: 'contentscript.bundle.js',
    });
  });
});
