# Loom

Loom is a browser for working with large-scale single-cell RNA-seq datasets stored in `.loom` format. You can visualize the data using heatmaps, tSNE plots, PCA and sparklines. In the future, you may be able to run clustering and similar tools from inside Loom.

### The `.loom` file format

Loom works with files in `.loom` format, a fast, scaleable format for omics data. To learn more, read the [`.loom` User Guide](/docs/loom_format.md).

### Using Loom

1. Install [Anaconda](https://www.continuum.io/downloads) for **Python 2.7** (not 3.xx).
2. Download the [latest release](https://github.com/linnarsson-lab/Loom/releases).
3. Get a dataset in .loom format (e.g. `data/cortex_5000.loom` in this Git repo).
4. Run `loom` in your Terminal (from the `release` directory).
5. Go to `localhost:5000` in your browser.
6. Enjoy.

##### Troubleshooting

The Loom server starts and says something like:
```
Serving from: /Users/gioele/Loom
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
127.0.0.1 - - [16/Jan/2016 17:52:11] "GET / HTTP/1.1" 404 -
```
...but you get "404 Not Found" in the browser. Make sure you are running "loom" from the release folder, and not from the root of the repository.

 
### Building Loom

If you want to contribute to Loom, you need to set up your development environment:

1. Install `node` ([Node.js](https://nodejs.org/en/) - Debian and Ubuntu users are advised not to install the default package but [follow these instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions))
2. Start Terminal and `cd` to where you want to work: `cd my-dev-dir`
3. Clone this repository: `git clone https://github.com/linnarsson-lab/Loom.git`
4. Go to the main Loom folder (`cd Loom`)
5. Install required node modules using `npm`

```
sudo npm install -g browserify
sudo npm install -g uglify-js
sudo npm install -g uglifycss
npm install babelify
npm install babel-preset-es2015 babel-preset-react
npm install whatwg-fetch
npm install lodash
npm install react
npm install redux
npm install react-redux
npm install redux-thunk
npm install bootstrap
npm install leaflet
npm install autoscale-canvas
```

Run `./build` 

This will create a new folder `release`. Run `release/loom` to start the loom server (or `release/loom debug` to run in debug mode).

**Note:** By default, React is built in production mode, with less informative error messages (but good performance). To build in debug mode, run the build script with `./build debug`
