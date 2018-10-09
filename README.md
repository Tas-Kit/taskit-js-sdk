Taskit JS SDK
======

## Usage

```js
import MiniApp from 'taskit-js-sdk'

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
    getChildren: func(): Promise<TObject[], {data: {message: string}}>
    addChildren: func(props): Promise<TObject[], {data: {message: string}}>
    removeChildren: func(childIds): Promise<originResponse, {data: {message: string}}>
}

type tobjs = TObject[]
```

## Local Testing

1. Create `credentials.json` with content `{ "JWT": "eyJ0eXAiOiJKV1Q***" }`
2. Fill the api you want to test in the area where flag `Test API here` in [./test.js](./test.js)
3. run command `node test.js`
