#!/usr/bin/env bash
mkdir ukrainian-news
mkdir ukrainian-news/img
mkdir ukrainian-news/resource
cp *.js ukrainian-news
cp *.json ukrainian-news
cp *.css ukrainian-news
cp *.html ukrainian-news
cp img/*.* ukrainian-news/img
cp resource/*.otf ukrainian-news/resource
zip -rmq ukrainian-news.zip ukrainian-news