Taskit JS SDK
======

## Usage

```js
/**
 * type NodeInfo = {
 *   oid: string,
 *   labels: array,
 *   properties: array,
 *   key: string,
 *   role: number
 * }
 * type data.result = {<oid: string>: NodeInfo}
 */

import Taskit from 'taskit-js-sdk'

const taskit = new Taskit(mini_app.aid, mini_app.key)

// Create Group
taskit.createNode({
    name: 'HelloWorld',
    labels: ['GroupModel'],
}, parent_oid, parent_key)
    .then(({ data }) => console.log('Created group: ', data.result))
    .catch(error => console.error(error))
```

## Local Testing

1. Create `credentials.json` with content `{ "JWT": "eyJ0eXAiOiJKV1Q***" }`
2. Fill the api you want to test in the area where flag `Test API here` in [./test.js](./test.js)
3. run command `node test.js`
