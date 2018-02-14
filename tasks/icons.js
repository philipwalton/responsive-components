const SVGSpriter = require('svg-sprite');
const {generateRevisionedAsset} = require('./utils/assets');


const fs = require('fs-extra');
const gulp = require('gulp');
const iconsPath = require('material-design-icons').STATIC_PATH;
const path = require('path');

const icons = [
  'action/assignment',
  'action/chrome_reader_mode',
  'action/favorite',
  'action/home',
  'action/info_outline',
  'action/picture_in_picture',
  'action/thumb_up',
  'action/today',
  'navigation/arrow_forward',
  'av/note',
  'editor/insert_comment',
  'editor/insert_emoticon',
  'editor/insert_link',
  'hardware/devices_other',
  'navigation/apps',
  'navigation/arrow_back',
  'navigation/close',
  'navigation/menu',
  'social/share',
  'toggle/star',
];

gulp.task('icons', (done) => {
  const iconSvgs = icons.map((icon) => {
    const [category, name] = icon.split('/');
    const filepath = path.join(iconsPath, category, 'svg', 'production',
        `ic_${name}_24px.svg`);

    return {
      name,
      category,
      filepath,
      svg: fs.readFileSync(filepath, 'utf-8'),
    };
  });

  const spriter = new SVGSpriter({
    mode: {inline: true, symbol: true},
  });

  for (const {filepath, name, svg} of iconSvgs) {
    spriter.add(path.join(path.dirname(filepath), `${name}.svg`), null, svg);
  }

  spriter.compile(async (err, result) => {
    if (err) {
      console.error(err);
    }
    try {
      await generateRevisionedAsset('icons.svg', result.symbol.sprite.contents);
    } catch (err) {
      console.error(err);
    }

    done();
  });
});
