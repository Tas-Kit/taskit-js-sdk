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
 * type data.result = NodeInfo[]
 */

const taskit = new Taskit(mini_app.aid, mini_app.key)

// Create Group
taskit.saveGroup({ name: 'HelloWorld' })
    .then(({ data }) => console.log('Created group: ', data.result))
    .catch(error => console.error(error))

// Get All Groups
taskit.loadGroups()
    .then(({ data }) => console.log('All groups: ', data.result))
    .catch(error => console.error(error))

// Get and delete All Groups
taskit.loadGroups()
    .then(({ data }) => {
        console.log('All groups: ', data.result)
        return taskit.deleteGroups(data.result.map(info => info.oid))
    })
    .catch(error => console.error(error))
```

## Local Testing

1. Create `credentials.json` with content `{ "JWT": "eyJ0eXAiOiJKV1Q***" }`
2. Fill the api you want to test in the area where flag `Test API here` in [./test.js](./test.js)
3. run command `node test.js`
