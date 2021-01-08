# splitio-react
> An alternative React solution for [Split.io](https://www.split.io/).

## How to Install

```
npm install split-react
```

or

```
yarn add split-react
```
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

... to be continued