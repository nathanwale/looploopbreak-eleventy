---
title: Mastodon Client
date: 2024-06-01
tags: 
    - ActivityPub
    - Mastodon
    - Swift
    - SwiftUI
    - iOS
summary: A write-up of my bare-bones Mastodon client written in SwiftUI
---
![Screenshot of my Mastodon client](/images/thumbnails/mastodon-client.png)
**GitHub**: [https://github.com/nathanwale/MastodonAndOn](https://github.com/nathanwale/MastodonAndOn)<br />
**Video tour**: [https://www.youtube.com/watch?v=nwX7kLQ9nus](https://www.youtube.com/watch?v=nwX7kLQ9nus)
# Intro
This is a barebones Mastododon client that I wrote. I called it *MastodonAndOn,* and I apologise for that, I just couldn't think of a better one.

It's useable, but I wouldn't recommend it as an actual Mastodon client. For that reason, it's not on the App Store. You can, however, look at the [code on GitHub](https://github.com/nathanwale/MastodonAndOn) and try running it for yourself. 

If you are looking for a Mastodon client, I'd recommend the [IceCubes App](https://github.com/Dimillian/IceCubesApp). I'm pretty happy using this one on a daily basis.
## Rationale
I built this app for several reasons:

- To learn SwiftUI
- To learn Mastodon
- To gain experience working with Remote APIs and OAuth
- To have a proof of competency to show potential employers
## Video tour
You can see it in action in this video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/nwX7kLQ9nus?si=RZfRq4OuFN84MAu2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# Mastodon
Mastodon is a federated microblogging platform. Mastodon is built on [ActivityPub](https://www.w3.org/TR/activitypub/), which I've [written about before](/posts/activity-pub/).

I've detailed some of the terminology, for those who aren't familiar with it:
## Microblogging
Posting short (only a few hundred characters) articles to the Internet. As popularised by Twitter.
## Mastodon
A federated microblogging standard. It is based on ActivityPub.
## Federation
When separate networks are able to communicate with each other through some kind of shared standard. Email would be the most famous example. This means users can choose the service of their liking, but still communicate with others on a different service.
## Mastodon Instance
A particular server that a Mastodon user is logged in to. Instances communicate with each other, so that posts from one instance appear in another. Instances can also *defederate* from others, meaning that they cease communicating. Defederation can be used when an instance becomes abusive, or has proven to not be secure.

Instances are referred to in Mastodon accounts after the second `@`. In `@nwale@mastodon.social`, `nwale` is the username, `mastodon.social` is the instance.
## Status / Post
A Mastodon "status" is what other services might call a post. "Status" is what is used in the Mastodon documentation and the remote API, though "post" is used in the interface of the official web client. "Status" is a carry-over from ActivityPub.
## Timeline
A timeline is a series of posts from accounts that a user follows. There is also a public timeline that publishes all federated posts.
## Boost / Reblog
Users can "boost" posts to share them with their followers. This might be called "reblogging" on other services, and that is how it's referred to in the spec.
# Functional Design
## Mastodon differences with other microblogging services
Mastodon being federated poses some unique challenges compared to something like Twitter.

- Users have to choose an instance to log in
- Another user might be on a different instance, and that will be specified in their mentions (eg. `user@instance.org`)
- Instances might be configured differently for things like character limits and URLs for streaming and web-sockets, plus max number of attachments, etc.
## User Interface
The UI is modelled after the fairly common "bottom tab" style found in many mobile apps.

![A mockup of the user interface](/images/mastodon-client/ui-mockup.png)

The bottom tabs let you navigate between your timeline, your notifications, the public timeline, and your profile. The top shows the Mastodon Instance that you're logged in
### User timeline
The user timeline is the timeline of the logged in user. This shows posts from other users that you're following, as well as your own posts. It's the default view, as it's most likely what you want to look at when opening the app.
### Notifications
Notifications show you activity related to posts you've interacted with. Including:

- When someone has replied, favourited or boosted one of you posts
- When someone has begun following you or has requested to follow you
- When a poll you've voted on has ended
- When you've been mentioned in a post (ie. `@username`)
- When a post you've interacted with has been edited or updated
### Public Timeline
The public timeline is the timeline of all posts federated by your Mastodon instance. Sometimes risky.
### User Profile
The User Profile screen shows the user's posts, profile information, plus their profile image. When accessed from the bottom tab, it will show the profile of the logged in user. It can also be accessed by tapping an `@username` in a post, in which case it will show that user's profile. 

The user profile is also where you can log out.
### Post Composer
The post composer will attempt to give a list of auto-completions when typing hashtags (eg. `#cats`) or usernames (eg. `@username`). It also allows setting the content as sensitive, and giving a reason. When a post is set to sensitive, the content will be obscured and the reason displayed. Users can then tap the post to reveal the content.

A character counter also shows how many characters you have left to use in your post. If the post is a reply to another, then the original post is also displayed. 
### Sensitive content
Mastodon posts can be marked as "sensitive". There are a variety of reasons why you might do this. The content might be inappropriate for some audiences, or it might just be a spoiler for a movie. Users can specify a reason the post is sensitive.

If a post is marked as sensitive, it should be obscured by default and the reason given for marking it as sensitive. The user can then tap the post to reveal it.
## Out of scope
The following features I've decided not to implement.
### Styling and highlighting when composing
A lot of composers will allow bolding, italics and highlighting of hashtags, mentions and URLs. The composer in this client only offers plain text. Though it does give suggested completions for hashtags and usernames.
### Multiple accounts
This client only allows one logged in account at a time. To use another account you'll have to log out and log in with a new one.
### Other Mastodon features
The client also omits other Mastodon features, such as:

- Direct messages
- Filters
- Blocking and muting accounts

# Technical Design
## SwiftUI
SwiftUI was chosen both as a chance to learn it, and because I enjoy the declarative style. With SwiftUI, XCode also allows live previews, which is very useful for iteration.
## Auth
Mastodon uses OAuth to authorise apps to use a user's account. SwifUI provides the environment variable `webAuthenticationSession` that will launch an external Safari process. On successful authorisation, a URL is returned with an authorisation code embedded in the query string. That code is then submitted to another request to acquire an access token. That token is then stored on the [Keychain](https://developer.apple.com/documentation/security/certificate_key_and_trust_services/keys/storing_keys_in_the_keychain).

You can see the code for this process in the `beginSignIn()` function of [UserLoginView](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Views/Login/UserLoginView.swift).

### Secrets
API keys are obfuscated using an algorithm outlined by [Chris Hulbert](https://www.splinter.com.au/2019/05/05/obfuscating-keys/). The obfuscated string of bytes is kept on the [`Keys` struct](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Models/Keys.swift), which will automatically de-obfuscate key. There is also a Playground that can be used to obfuscate them. It's not secure, but designed to prevent them being snagged from GitHub by a web crawler.

An access token for previewing content is kept on the `Secrets` struct. Git is then configured to ignore updates to this file, so that the value is not committed.
## Persistence
Persistent user information is stored on a [`Config` object](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Local/Config.swift). The `Config` struct has a shared instance at `.shared`, which can be accessed from views to store pre-defined properties. 

Data is stored using the `@AppStorage` decorator in most cases, but uses the Keychain to secure the logged in access token.

A `ConfigProvider` protocol allows me to create a Preview version of the config for testing.
## No ViewModel
I chose not to use the ViewModel pattern with SwiftUI. This choice was inspired by this informative, yet unhinged, Apple Developer Forum thread by user [Appeloper](https://forums.developer.apple.com/forums/profile/Appeloper):  [Stop using MVVM for SwiftUI](https://forums.developer.apple.com/forums/thread/699003).

Occasionally behaviour was abstracted out to an external object when things became to unwieldy. Post character counting, for instance, isn't a simple string length value in Mastodon. URLs are all counted as being 23 characters, and the instance portion of a user mention is ignored (ie. `@user@mastodon.social` is counted as only 5 characters). In this case it was helpful to have a [`StatusCharacterCounter`](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Models/StatusCharacterCounter.swift) struct.
## Remote API interface
All remote API request objects conform to a [`ApiRequest`](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Remote/ApiRequest.swift) protocol. An `ApiRequest` conforming object requires that `host` and `endpoint` are provided, as well as a `Response` type. You can also provide an HTTP method (defaults to `GET`), query items, an access token or specify that an idempotency key is required.

`ApiRequest` means that an API request definition can be very succinct. Here is the full code for an object that requests information about an instance from a host:

```swift
struct InstanceRequest: ApiRequest
{
    typealias Response = MastodonInstance
    
    var host: String
    let endpoint: Endpoint = .instance
}
```

`MastodonInstance` is the type returned from `.send()`. The `.instance` endpoint is defined in the `Endpoint` enum.
### Endpoint
[`Endpoint`](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Remote/Endpoints.swift) is an `enum` that specifies all endpoints for the API. This means that the string only has to be defined once, and they can all be checked in one place.
## Models
All models conform to Swift's `Codable` protocol. This means that they can be decoded from or encoded to JSON rather easily. 

For example, if you look at the code for [`MastodonInstance`](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Models/MastodonInstance.swift), you'll see that only properties and their types have to be defined. The decoder and encoder can be configured. Here's the configuration for the decoder:
<a href='#date-decoder'></a>
```swift
static var decoder: JSONDecoder {
	let decoder = JSONDecoder()
	decoder.keyDecodingStrategy = .convertFromSnakeCase
	decoder.dateDecodingStrategy = .mastodon
	return decoder
}
```

The JSON in the Mastodon API uses `python_case`. Setting `.keyDecodingStrategy` to `.convertFromSnakeCase` will mean that keys like `source_url` in the JSON payload, will be converted to `sourceUrl` on the `MastodonInstance` model, and vice versa. Setting the date decoding strategy is explained under **Problems**.
## Navigation
Navigation is handled by pushing a [`Route` enum](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Models/Route.swift) onto an [`AppNavigation` object](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Models/AppNavigation.swift). `AppNavigation` conforms to `ObservableObject` so that it's `path: [Route]` property can trigger changes in the interface. `AppNavigation.push(route: Route)` is used to change the navigation path.
### Internal URLs
Internal URLs with a custom scheme are used to create internal navigation links in posts. Both `#hashtags` and `@usernames` are converted to internal links. The scheme is registered in the app config, and internal URLs are handled with SwiftUI's `.onOpenURL`. Internal URLs are converted to `Route`s with an [extension on `URL`](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Extensions/URL%2B.swift).
## Request Views and Concrete Views
Wanting to have views that were testable with in-memory data, and also be able to load data from the Internet, led to overly complicated properties on views. The solution was to create "Request Views" whose responsibility is to request data, show progress spinners, and handle any errors that may occur. When data is successfully loaded, they then display the concrete version of the view.

So generally the Request View will take a request object, while the concrete view will take a model object.

For example, [`StatusListRequestView`](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Views/Status/StatusList.swift) takes a request object that returns a list of Statuses. When it succeeds, it creates a `StatusList` with the array that was loaded.

This pattern greatly simplifies View code. Request View could also be generalised into a protocol.

![A diagram of the Request View pattern](/images/mastodon-client/request-view.png)
# External dependencies
## SwiftSoup
[SwiftSoup](https://github.com/scinfu/SwiftSoup) is an HTML parser based on Python's [BeautifulSoup](https://beautiful-soup-4.readthedocs.io/en/latest/). In this project it's used to parse the HTML in posts and convert them to marked up `AttributedString`s.

It was created by [Nabil Chatbi](https://github.com/scinfu).
## CachedAsyncImage
[CachedAsyncImage](https://github.com/lorenzofiamingo/swiftui-cached-async-image) is a version of SwiftUI's built-in `AsyncImage` that also caches images. It's used whenever an image is fetched from the internet.

It was created by [Lorenzo Fiamingo](https://github.com/lorenzofiamingo).
# Testing
## Unit testing
I used XCode's in-built `XCTest` for unit tests. Because all the models are decoded from JSON, it was natural to use JSON files to store test data. Most unit tests will decode one of these files into a Model object to test. There are also some tests for decoding models from the live API, mostly to confirm that endpoints, etc. are correct.
## Previews
I found SwiftUI's live previews really useful for iteration. To facilitate previews I found it useful to [extend the models](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Preview%20Content/PreviewModels.swift) to provide a preview or sample version of that model. Usually these models were also loaded from JSON files.
# Problems and solutions
## Some models have recursive types
`MastodonAccount.moved` is a `MastodonAccount`. Similarly `MastodonStatus.reblog` is a `MastodonStatus`. Recursive types mean that the size of that type is unknowable at compile-time — therefore they cannot be structs (value types) and have to be classes (reference types). Furthermore it means that the classes' members have to be either optional or coerced (ie. `var name: String!`) . Otherwise `Codable` can't automatically assign members from JSON data, and you would have to write an `init(..)` to initialise every single member yourself.

Not a deal-breaker, but not ideal.
## Sometimes the API uses empty string for null
In some places Mastodon uses empty string for a null value. This bypasses Swift's use of native optionals, and means that all values on that model have to be manually decoded in `init(from: Decoder)`.

These instances aren't noted in the docs, and can cause unexpected decoding failures.
## Mastodon's Date format differs from the default JSON coding in Swift
The JSON date format that Mastodon uses is different from the default Swift JSON format. Specifically, Mastodon uses fractional seconds. Thankfully, Swift makes it easy enough to extend `JSONDecoder.DateDecodingStrategy`. You can see the extension I wrote for it [here](https://github.com/nathanwale/MastodonAndOn/blob/main/Mastodon/Extensions/JSONDecoder_DateDecodingStrategy.swift).  With the extension, you can simply set `.dateDecodingStrategy = .mastodon` on your JSON decoder, as seen [above](#date-decoder).
## Swift's WebViews behave strangely in lists and are hard to format
Mastodon posts are encoded as HTML inside JSON. The simple thing to do would be to use some kind of web view in the app. Unfortunately I found this behaved strangely inside `List`s and `NavigationStack`s. Particularly views would sometimes repeat themselves. This bug may have been fixed in later versions of SwiftUI, but I haven't had a chance to check.

Also, embedded web views cannot be formatted using SwiftUI's native modifiers (`.font(..)`, for example). The way around this is to inject CSS with each post.

Instead, I decided to use SwiftSoup to parse the HTML and convert it into tokens. You can see this code in [`ParsedText`](https://github.com/nathanwale/MastodonAndOn/tree/main/Mastodon/Models/ParsedText). This may have been overkill, but it did make it simple to convert hashtag and user-mention links into internal links.
## XCode Preview won't handle external or internal URLs
XCode preview won't open external links, presumably because it doesn't want to open an entire iOS Safari instance. This can be pretty confusing at first, as it also applies to using SwiftUI's `webAuthenticationSession`. Even more confusingly, it also applies to internal URLs (as described in the *Navigation* section above).

The only solution here is to check links in the iOS Simulator.
# Yet to be implemented
The following features I hope to get to implementing at some point.
## Push notifications
The app currently doesn't notify users of activity outside the Notifications Tab inside the app. `UNUserNotificationCenter` could be used to push notifications when the user is outside of the app.
## Uploading media
You can't upload media with your post using this client. It would be nice to allow the uploading of images at least, as most people seem to use external services for video and audio (eg. YouTube).
## Navigation persistence
User navigation could be saved in `Config`. That way the app would pop right back to where the user was after quitting the app. This isn't a high priority. The app does save login details, and re-opening the app at the User Timeline tab is a decent default.
## Grouping notifications
Notifications in the Notification Tab aren't currently grouped. For instance, all favourites of a post will be listed separately. This would get fairly noisy if a post becomes popular. 

Notifications could be grouped so that they display something similar to "User and XX others have favourited your post."
## Interactive polls
Polls currently can't be participated in. Buttons could be added to make them interactive, plus an API request to register the choice with the server. 
# Conclusion
This was a long and challenging project. I learned a lot about SwiftUI, JSON Decoding and the Mastodon API. There are some frustrating things about the Mastodon API — for example, inconsistencies in naming and nulls. Also inconsistencies between the docs and the implementation.

SwiftUI is fun when it works, and I learnt a lot more about declarative app-building. There are some things missing though, and I hope they'll be filled out soon.

For the next project I would also like to pick something that will actually hit the app store. It would be interesting to have experience doing that, and have other people actually be able to use it.
