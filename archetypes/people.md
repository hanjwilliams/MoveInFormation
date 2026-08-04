+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
weight = 1
banner = ''
[build]
  list = 'always'
  publishResources = true
  render = 'always'
+++