# node-test
it will be available on
    localhost:3000/:node_id/:language
Here node_id and language are request parameters required, so you have to value of these 2 parameters in the url with valide value.
otherwise it will return message 'Missing Mandatory Words!'
example: filter by {node_id: 5, language: 'english'}, the url should be like: localhost:3000/5/english

then if you want to search some characters on the name the node_tree_names'row.
you can insert parameters named search with string value.
example: filter by {search: 'docebo'}, the url should be like localhost:3000/5/english/?search=abcd

the parameters: page_num, page_size works similarly.


