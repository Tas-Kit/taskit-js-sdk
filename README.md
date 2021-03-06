Taskit JS SDK
======

## Usage

```js
const { TObject: MiniApp } = require('taskit-js-sdk')

const app = new MiniApp(mini_app.aid, mini_app.key)

// Fetch all children nodes
app.getChildren().then(tobjs => console.log(tobjs.map(({ oid, key }) => ({ oid, key }))))

// Add child node
app.addChildren([{labels: ['GroupModel'], properties: { name: 'FirstGroup' }}])
  .then(tobjs => tobjs[0].addChildren([{labels: ['ScheduleModel'], properties: { name: 'FirstSchedule' }}]))

// Delete children nodes
app.getChildren().then(tobjs => app.removeChildren(tobjs.map(tobj => tobj.oid))).then(data => console.log(data))
```

## Data Structure

```
type TObject = {
    oid: string
    key: string
    getChildren: func(): Promise<TObject[], Error>
    addChildren: func(props): Promise<TObject[], Error>
    removeChildren: func(childIds): Promise<Response, Error>
}

type tobjs = TObject[]

type Response = {
    data: {[prop: string]: any}
}

type Error = {data: {message: string}}
```

## Local Testing

1. Create `credentials.json` with content `{ "JWT": "eyJ0eXAiOiJKV1Q***" }`
2. Fill the api you want to test in the area where flag `Test API here` in [./test.js](./test.js)
3. run command `node test.js`
