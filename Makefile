all: build recruit.min.js index.html recruit.css chain.json
	cp index.html build
	cp recruit.css build
	cp recruit.min.js build/recruit.js
	cp chain.json build

build:
	mkdir -p build

recruit.min.js: build recruit.js
	uglifyjs recruit.js --screw-ie8 -m -c -o recruit.min.js

chain.json:
	go run markov.go  -print-chain < train/body.txt > chain.json

clean:
	rm -rf build recruit.min.js chain.json