mkdir ukrainian-news
mkdir ukrainian-news\img
mkdir ukrainian-news\resource
copy *.js ukrainian-news
copy *.json ukrainian-news
copy *.css ukrainian-news
copy *.html ukrainian-news
copy img\*.* ukrainian-news\img
copy resource\*.otf ukrainian-news\resource
IF EXIST ukrainian-news.zip del /F ukrainian-news.zip
#zip ukrainian-news.zip ukrainian-news -r
#rmdir ukrainian-news /s/q