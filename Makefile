BUILDDIR := build/
NAME := gotofoo
MANIFEST := src/manifest.json
VERSION := $(shell cat ${MANIFEST} | \
	sed -n 's/^ *"version": *"\([0-9.]\+\)".*/\1/p' | \
	head -n1)

all: prepare firefox

prepare:
	mkdir -p build

firefox: prepare
	rm -f ${BUILDDIR}${NAME}-${VERSION}.xpi
	zip -9j ${BUILDDIR}${NAME}-${VERSION}.xpi -j src/*

clean:
	rm -rf ${BUILDDIR}
