import { ColorComparisonPage } from './app.po';

describe('color-comparison App', function() {
  let page: ColorComparisonPage;

  beforeEach(() => {
    page = new ColorComparisonPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
