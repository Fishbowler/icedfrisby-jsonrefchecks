# icedfrisby-jsonrefchecks
IcedFrisby plugin to check referential integrity between different sections of an API response

## Usage

Pass two jsonpath specifications, a list of candidates (1) that must exist in the list of references (2)

`.expectJSONRefDataExists(candidates, references, [options])`

## Purpose

Where a JSON response to an API request contains internal references, you may wish to validate them.

```
{
  "things": [
    {
      "id": "00fb60c7-520e-4228-96c7-13a1f7a82749",
      "name": "Thing 1",
      "url": "https://lolagons.com"
    },
    {
      "id": "709b85a3-98be-4c02-85a5-e3f007ce4bbf",
      "name": "Thing 2",
      "url": "https://lolfacts.com"
    },
    ...
  ],
  "layouts": {
    "sections": [
       {
          "id": "34f10988-bb3d-4c38-86ce-ed819cb6daee",
          "name": "Section 1",
          "content:" [
             {
               "id": "00fb60c7-520e-4228-96c7-13a1f7a82749" //This is a ref to Thing 1
             }
          ]
       },
       ...
     ]
  }
}
```

Here, `things` is the reference set, and `content` contains references to `things`. We need to validate that all `content` exists within `things`.

## Example

For the above JSON:

```JavaScript
const { mix } = require('mixwith')
const frisby = mix(require('icedfrisby')).with(require('icedfrisby-jsonrefchecks'))

frisby.create('Example Referential Integrity Check')
    .get('http://example.com/lol')
    .expectJSONRefDataExists('layouts.sections[*].content[*].id', 'things[*].id')
.toss();
```

This is a simple example containing only objects and arrays, but jsonpath supports lots of the features of XPath, and can query on a whole host of things, including data, existence of properties, those of parents/children, and combinations of all of them.

## Options

Options is an object that contain any of these properties:

* `debug` - When true, print the count of results from the candidate and reference jsonpath queries. Default: false.
* `failOnZeroCandidates` - When true, fail the check if the candidate jsonpath query returns 0 results. This is useful for development and where data should exist, since 100% of 0 candidates will always appear in the references set. Default: false.

## Further reading

jsonpath - https://www.npmjs.com/package/jsonpath
