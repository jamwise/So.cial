So.cial
=======

So.cial is a wrapper for facebook, instagram and twitter integration. I'll be adding more features to it as they become needed by my development work. I'll update the readme when it becomes more solid as a re-usable class.

Here is some example usage:

If you're using facebook, the first thing to do is init:

**"appid"** : facebook app id set up in developers.facebook.com *(required)* 

**"callback"** : this is the actual function reference, not a string *(not required)*

**"permissions"** : string of facebook permissions *(not required)*

**"redirecturi"** : whatever domain you have set up in your facebook app, only add this if you want to use the server side flow and avoid a javascript pop up, otherwise don't put anything here *(not required)*

```
so.cial({
  appId         : 	FACEBOOK APP ID, 
  callback      : 	FACEBOOK LOADED CALLBACK FUNCTION, 
  permissions   : 	'', 
  redirectUri   : 	FACEBOOK APP SOURCE URL
});

```

Here's how you call the facebook share dialog (ONLY THE DESCRIPTION IS REQUIRED):

```
so.share({
	link          : LINK TO SHARED PAGE,
	title         : TITLE OF THE SHARE MESSAGE,
	picture       : LINK TO PICTURE TO BE SHOWN NEXT TO SHARE TEXT,
	description   : TEXT DESCRIPTION (MAIN SHARE MESSAGE),
	caption       : SMALLER TEXT THAT SHOWS UP UNDER THE TITLE
}, CALLBACK FUNCTION);

```

Here's how you call the twitter share dialog (ONLY THE DESCRIPTION IS REQUIRED):

```
so.twitterShare({
	link          : LINK TO SHARED PAGE,
	description   : TEXT DESCRIPTION (MAIN SHARE MESSAGE),
});

```
