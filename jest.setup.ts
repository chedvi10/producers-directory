import '@testing-library/jest-dom'

// סביבת jsdom לא כוללת fetch - סטאב ברירת מחדל (בדיקות ספציפיות דורסות אותו לפי הצורך)
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;
}
