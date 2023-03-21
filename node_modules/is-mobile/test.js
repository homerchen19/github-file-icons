const test = require('tape')
const describe = require('tape-describe')
const UserAgent = require('user-agents')
const isMobile = require('./')

const iphone =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3'
const chrome =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36'
const ffos = 'Mozilla/5.0 (Mobile; rv:18.0) Gecko/18.0 Firefox/18.0'
const ipad =
  'Mozilla/5.0 (iPad; CPU OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1'
const ios13ipad =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
const ios13ipadpro =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15'
const samsung =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/92.0.4515.166 Safari/537.36'
const chromeOS =
  'Mozilla/5.0 (X11; CrOS armv7l 12105.100.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.144 Safari/537.36'

test('is mobile', function (t) {
  t.ok(isMobile({ ua: iphone }))
  t.ok(isMobile({ ua: ffos }))
  t.notOk(isMobile({ ua: ipad }))
  t.ok(isMobile({ ua: ipad, tablet: true }))
  t.ok(isMobile({ ua: { headers: { 'user-agent': iphone } } }))
  t.notOk(isMobile({ ua: chrome }))
  t.notOk(isMobile({ ua: { headers: { 'user-agent': chrome } } }))
  t.notOk(isMobile())
  t.notOk(isMobile({ ua: { headers: null } }))
  t.notOk(isMobile({ ua: { headers: { 'user-agent': null } } }))
  t.ok(isMobile({ ua: samsung }))
  t.notOk(isMobile(chromeOS))
  t.notOk(isMobile(chromeOS, { tablet: true }))

  global.navigator = {}

  global.navigator.userAgent = iphone
  t.ok(isMobile())
  t.ok(isMobile({ tablet: true }))

  global.navigator.userAgent = chrome
  t.notOk(isMobile())
  t.notOk(isMobile({ tablet: true }))

  global.navigator.userAgent = ipad
  t.notOk(isMobile())
  t.ok(isMobile({ tablet: true }))

  global.navigator = { maxTouchPoints: 5 }
  t.ok(isMobile({ ua: ios13ipad, tablet: true, featureDetect: true }))
  t.ok(isMobile({ ua: ios13ipadpro, tablet: true, featureDetect: true }))

  t.end()
})

describe('ua-bruteforce', function () {
  const limit = 300
  const checks = [
    { deviceCategory: 'mobile', result: true },
    { deviceCategory: 'tablet', result: true, tablet: true },
    { deviceCategory: 'desktop', result: false }
  ]
  const testCases = checks.reduce(
    (cases, { deviceCategory, result, tablet }) => {
      // The same user-agent string belongs to both `desktop` and `mobile` type entries. No chance to detect `deviceType` properly.
      // https://github.com/intoli/user-agents/blob/867e318bc00880ae00437e5e8efaa8e5e7ac0696/src/user-agents.json.gz
      // user-agents v1.0.843
      const exclude =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
      const ua = new UserAgent([
        ({ userAgent }) => userAgent !== exclude,
        { deviceCategory }
      ])

      return [
        ...cases,
        ...new Array(limit).fill().map(() => ({
          ua: ua.random().toString(),
          result,
          tablet
        }))
      ]
    },
    []
  )

  testCases.forEach(({ ua, result, tablet }) => {
    test(ua, t => {
      t.equal(isMobile({ ua, tablet }), result)
      t.end()
    })
  })
})
