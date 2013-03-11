# LivePreviewTemplate

This plugin enables the Movable Type to convert a template file that saved in desktop to preview page.

![Screenshot](https://github.com/usualoma/mt-plugin-LivePreviewTemplate/raw/master/artwork/screenshot.png)


## Features
* Import a local template file from desktop to the MT by drag and drop.
* Rebuild automatically after saving file.


## Demo Movie
http://screencast.com/t/g4Yglsrauy


## Use as bookmarklet
1. Save `javascript:(function(){var%20s=document.createElement('script');s.setAttribute('src','https://github.com/usualoma/mt-plugin-LivePreviewTemplate/raw/master/mt-static/plugins/LivePreviewTemplate/LivePreviewTemplate.js?ts='+new Date().getTime());document.getElementsByTagName('body')[0].appendChild(s);})();` as a bookmark.
  * You can also add a bookmark from this page.
    http://usualoma.github.com/mt-plugin-LivePreviewTemplate/
2. Open a "Edit Template" screen in MT.
3. Click a saved bookmark.


## Requirements
* MT5.2

## Supported browsers
You may need to permit opening a pop-up window.
* Google Chrome
* Firefox
* Safari

## Thanks
* Inspired by [Markdown Previewer](https://github.com/komiya-atsushi/markdown-previewer)

## LICENSE

Copyright (c) 2013 ToI Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
