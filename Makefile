all: build build/recruit.min.js index.html recruit.css chain.json
	cp index.html build
	cp recruit.css build
	cp chain.json build

build:
	mkdir -p build

build/recruit.min.js: build recruit.js
	uglifyjs recruit.js --screw-ie8 -m -c -o build/recruit.js

clean:
	rm -rf build