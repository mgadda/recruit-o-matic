all: build_dir recruit.min.js prng.min.js chain.min.js index.html recruit.css chain.json
	cp index.html build
	cp recruit.css build
	cp recruit.min.js build/recruit.js
	cp prng.min.js build/prng.js
	cp chain.min.js build/chain.js
	cp chain.json build
	cp TwitterLogo_white_16x16.svg build

build_dir:
	mkdir -p build

%.min.js: %.js
	uglifyjs $< --screw-ie8 -m -c -o $@

chain.json: markov/markov.go train/body.txt
	go run markov/markov.go  -print-chain < train/body.txt > chain.json

run: all
	cd build; python -m SimpleHTTPServer 8000

run_dev:
	python -m SimpleHTTPServer 8000

clean:
	rm -rf build *.min.js chain.json
