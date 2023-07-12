---
title: ActivityPub
date: 2023-07-12
tags: 
    - ActivityPub
    - web standards
    - social networks
summary: About ActivityPub, the open protocol for social networks
---

[ActivityPub](https://www.w3.org/TR/activitypub/) is a protocol for social networking. 

Unlike Twitter, FaceBook or [Pownce](https://en.wikipedia.org/wiki/Pownce), ActivityPub allows posts, etc. to be shared across different services. That is, it's decentralised. The point of decentralisation is to allow people to choose which services they use, and still allow them to interact with people on other sites. In this fashion it's similar to email. Or regular mail, I guess.

## Why?
People join the social networks that all their friends, family or favourite crypto scheme-selling child TV stars from the 90s are on. There's no point being on a social network that no one else is on, and therefore users feel locked in. Services can then potentially abuse their first-mover advantage by making their service more and more advertiser-friendly and user-hostile. And by "potentially," I mean "[actually](https://www.theguardian.com/technology/2014/jul/02/facebook-apologises-psychological-experiments-on-users)".

So when a social network becomes over-run with scammers and Illinois Nazis, or it turns out that the CEO collects endangered animals like they're Pokemon just to make them battle it out in his basement, there are normally only two options: do nothing, and go along with it, or delicately inform your friends that you're no longer looking at pictures of their cats.

With decentralised services you can pick where to go, and companies will have to treat us right for once. *(He says, optimistically.)*

There is also more room for non-profit or donation-supported services.

## Users
Because it's an open protocol, ActivityPub is used by a bunch of services with a variety of purposes:

| Service | Description |
| - | - |
| [Mastodon](https://joinmastodon.org/) | A microblogging platform |
| [Friendica](https://friendi.ca/) | A social network |
| [Pixelfed](https://pixelfed.org/) | A photo sharing platform |
| [PeerTube](https://joinpeertube.org/) | A video sharing platform |
| [Micro.blog](https://micro.blog/) | A blogging service |
| [Lemmy](https://lemmy.ml/) and [Kbin](https://kbin.social/) | Reddit usurpers |

## Vocab
ActivityPub describes **Actors** sending and receiving **Activities**. Actors have inboxes and outboxes where these Activities will appear as a **Stream**.

## Communication
ActivityPub has two layers:

1. **A server to server protocol for federation**. Federation is how ActivityPub achieves decentralisation.
2. **A server-to-client protocol**. This is how users can receive and send **Activities**.

## Activities
Activities are actions between Actors (see below) on the network. An `Activity` might include an `actor`, an `object` and a `target`. It will also include a `type`. An activity type might be: `Add`, `Block`, `Join`, etc. [A full description of Activity Types](https://www.w3.org/TR/activitystreams-vocabulary/#activity-types).

An example for the `Add` type from the above link:

```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "summary": "Sally added a picture of her cat to her cat picture collection",
  "type": "Add",
  "actor": {
    "type": "Person",
    "name": "Sally"
  },
  "object": {
    "type": "Image",
    "name": "A picture of my cat",
    "url": "http://example.org/img/cat.png"
  },
  "origin": {
    "type": "Collection",
    "name": "Camera Roll"
  },
  "target": {
    "type": "Collection",
    "name": "My Cat Pictures"
  }
}
```

## Actors
Users are represented by Actors, though an Actor isn't necessarily a User. [Actor Types](https://www.w3.org/TR/activitystreams-vocabulary/#actor-types) include: [`Application`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-application), [`Group`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-group),  [`Organization`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-organization) , [`Person`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-person) and [`Service`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-service). Each Actor has an ID, represented as a URL.

Actors have an **inbox** and an **outbox**, where they receive and send Activities much like email. Like the ID, the inbox and outbox are represented as URLs. Those URLs point to an [`OrderedCollection`](https://www.w3.org/TR/activitystreams-vocabulary/#dfn-orderedcollection) JSON object containing "Activities" (as described below in ActivityStreams). 

## Delivery
Everything a user publishes will end up in their outbox as an Activity.

An Activity might have a **target,** specified by the fields `to`, `bto`, `cc`, `bcc`, and `audience`. The target identifies an Actor, and from there we can find the Actor's inbox and send an HTTP POST request to that URL. 

If that request is successful, the Activity will then appear in the receiving Actor's inbox.

## ActivityStreams
ActivityPub is based on the [ActivityStreams 2.0](https://www.w3.org/TR/activitystreams-core/) data format. ActivityStreams is a JSON based format for describing activities in a "human-friendly but machine-processable and extensible manner." The spec says ActivityPub uses ActivityStreams as its "vocabulary." As a bit of an overview, this [vocabulary](https://www.w3.org/TR/activitystreams-vocabulary/) defines core types such as `Object`, `Link` and `Activity`.  These are all represented as JSON objects.

`Object` is a base type that most other types are based on. (All examples are from the above W3C link).

```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Object",
  "id": "http://www.test.example/object/1",
  "name": "A Simple, non-specific object"
}
```

> `@context` here refers to the location of the ActivityStreams spec, and comes from yet another spec: [JSON-LD](https://www.w3.org/TR/json-ld/).

`Link` is a reference to a resource that will include a URL (or *an* URL, depending how you pronounce it), a name, media type, etc. It is *not* a subtype of `Object`.

```json
{
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Link",
  "href": "http://example.org/abc",
  "hreflang": "en",
  "mediaType": "text/html",
  "name": "An example link"
}
```

You can see an example of an `Activity` type in the **Activities** section above.

## Flexibility
As you can see, ActivityPub is based on regular old web tech like [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) and JSON. That makes it fairly easy to work with on the web. For a cool example, check out Cassidy James Blaede's [Mastodon-powered blog comments](https://cassidyjames.com/blog/fediverse-blog-comments-mastodon/).

## Conclusion
Good old open protocols are what make the web, and give regular people a chance against the Metas, Twitters and Weylan-Yutanis of this world. They help fulfil the democratic promise of the World Wide Web — and social networks are the new battleground of that war.

So check out one of the ActivityPub powered services listed above, and consider giving them a shot. For the record, I'm [@nwale@mastodon.social](https://mastodon.social/@nwale).