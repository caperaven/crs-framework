rollup editor.js -f esm -o dist/editor.js -p @rollup/plugin-node-resolve
terser dist/editor.bundle.js --compress --mangle -o dist/editor.min.js
