all: build_dir recruit.min.js index.html recruit.css chain.json
	cp index.html build
	cp recruit.css build
	cp recruit.min.js build/recruit.js
	cp chain.json build

build_dir:
	mkdir -p build

recruit.min.js: build_dir recruit.js
	uglifyjs recruit.js --screw-ie8 -m -c -o recruit.min.js

chain.json: markov/markov.go
	go run markov/markov.go  -print-chain < train/body.txt > chain.json

run: all
	cd build; python -m SimpleHTTPServer 8000

clean:
	rm -rf build recruit.min.js chain.json