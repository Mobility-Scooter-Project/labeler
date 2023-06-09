.PHONY: build

setup:
	pip install -r assets/requirements.txt
	git submodule update --init
	mkdir video data

label:
	python -B ./GUI.py

build:
	pip install pyinstaller
	pyinstaller --noconsole --onefile GUI.py 
	pyinstaller GUI.spec
	python -B ./build_utils.py