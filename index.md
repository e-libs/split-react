# Welcome to split-react

## Introduction

If you're thinking about working with Feature Flags (aka Feature Toggles), on my repository you will find some really nice documentation, where I will guide you on how to use [Split](https://www.split.io/) with this light-weight alternative version: split-react. Besides its simplicity, its main goal is to avoid unnecessary re-renders depending on which flags are changed.

## Motivation

Split is a great and simple solution to work with [Feature Flags](https://en.wikipedia.org/wiki/Feature_toggle), that can be used to control your application behavior, toggling features on and off, performing progressive rollouts ([canary launching](https://featureflags.io/canary-launch/)), A/B testing and so on. 

Besides proving SDKs for several programming languages, it also allows you to start with the free tier, in which you may control simple _string flags_ (or _splits_, as they call them).

Even though their [React SDK](https://help.split.io/hc/en-us/articles/360038825091-React-SDK) works well and brings many cool features out of the box, there's a possible improvement point, which is the very reason of this library here.

## The Problem

Whenever there's a change in one of your flags, their SDK triggers updating events to all of your hooked components listening to Split's flags, **even if they're not related to the flag that's just changed**. That will cause unnecessary re-renders in your React application, something to avoid, ideally.

## The Goal

Instead of working on their own repository, this library has the goals of not only improving that by avoiding unnecessary re-renders, as well as providing an even leaner solution that basically takes their basic [Javascript SDK](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK) and enhances it to be used on a React application.

## The Solution

What this library does is basically creating a `SplitProvider` to wrap your application with, using a simple [Pub/Sub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) mechanism under the hood, which will only dispatch update events to the hooks that are listening to the specific flags that have changed. Simple as that!

## The Gist

1. Wrap your app with the `SplitProvider`
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SplitProvider } from 'split-react';
import { config } from './split/config';

ReactDOM.render(
  <SplitProvider config={config}>
    <App />
  </SplitProvider>,
  document.getElementById('root')
);
```

2. Use your Split config, the only required fields are the `authorizationKey` and `key`
```typescript
import { SplitConfig } from 'split-react';

const key = '[SOME_USER_KEY]';

export const config: SplitConfig = {
  core: {
    authorizationKey: '[YOUR_SPLIT_KEY]',
    key,
  },
};

```
3. In this example, `App.tsx` is calling this `Test.tsx`, just for the sake of separating the code

```tsx
import React from 'react';
import './App.css';
import { Test } from './components/Test';
// import TestHOC from './components/TestHOC';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Test splitName="test1" />
        {/* <TestHOC /> */}
      </header>
    </div>
  );
}

export default App;
```

4. Call the `useSplit` hook to evaluate your flag

```tsx
import React from 'react';
import { useSplit } from 'split-react';

export const Test = ({ splitName }: { splitName: string }) => {
  const split = useSplit(splitName, false);
  const color = split ? '#00FF00' : '#FF0000'
  return (
    <h1>The flag <i>{splitName}</i> is <strong style={{ color }}>{split ? 'ON' : 'OFF'}</strong></h1>
  );
};
```

5. If you prefer, you may use the HOC instead of the Hook, as exemplified with `TestHOC` component. To do so, simply uncomment those lines above (on `App.tsx`) to start using it.

You're all set! Now enjoy it, and see it in action  🎥

![](flag.gif)


## More?

Wanna jump right into the nitty-gritty details? Then you should definitely check out the repository with the [full documentation](https://github.com/e-libs/split-react). There you'll find examples and explanations on how I accomplished that.

## Questions?

Don't hesitate to [contact me](mailto:eric@e-libs.dev) if you have any questions or comments, they are all very much appreciated! Also, if you want to check out some my other projects, and get to know a little bit more about me, here's my page: [https://www.e-libs.dev](https://www.e-libs.dev/)

Have fun!