I've never been one for competition. In fact, I loathe it.

While competition, in some regard, may be beneficial for innovation, it seems that the innovation I create from it is passionless.

I write software because I love to write programs. When I write a program, it is written with a deep passion for mathematical symmetry, an aesthetical appeal of functional syntax, visual design, and interest in the program's function itself.

I do not program so that I can win. But, when I do, I hate what I have written.

[Free Food Github Repo](https://github.com/yemistar/FreeFood)

![free food](/images/freefood_app.png)

## Project

Comically, a good friend of mine had the 'brilliant' idea of creating an app with the sole purpose of finding free food. I'm not exactly certain what he had in mind when he thought of the idea, but all I saw was a starving college student, with a pile of empty pizza boxes laying around, and a few dollars in his wallet, desperately wanting to find some food. I'm fairly certain he did not understand the full gravity of the technological feat this app would require.

But, in order to make it work, we had to use the latest in software architecture and development. In summary, I'll go over the technologies we used and how we utilized them.

### Natural Language Processing (spaCy, nltk, Flask)

In order to find 'free food', an intelligent program was going to have to do it for us. This is where natural language processing (NLP) comes into play. NLP is the subset of artificial intelligence that can be taught to understand human language, in written or vocal form. Sirius, Alexa, or your Google Home are great examples of this. Sentiment analyzers, article generators, spam detection, and auto-correct language AI's are also some of the other examples where NLP is used.

For our use case, we had to write an AI that looked for a very specific thing: free food at an event or location. As one can imagine, finding the relevant data to create this AI was very difficult. So, to keep it simple, I simply found a website that generates sentences and selected sentences for each food word that would popularly be at an event (pizza, soda, candy, etc).

This process already took an enormous amount of time (several weeks), so, thankfully, the spaCy library already had EntityRecognizers for locations, organizations, dates, and times for which we could use to anaylze other parts of the sentences.

### Regular Expression Matching and Google Gmail API

Although the Gmail API is very verbose and easy to use, it's difficult to parse the results that are returned. In addition, I didn't seem to find much help when searching for a solution for parsing the emails. Regardless though, I was able to write a series of complex regular expressions and string manipulation methods that would convert raw base64 data into sentences for the AI to digest. However, it's not as easy as matching little newline/whitespace characters. Many emails that are sent out contain HTML. In fact, some emails were a huge mess of HTML that had to be parsed correctly to get the relevant information from it. Some information are just silly titles like 'Want more information?' or 'Look here!' that have absolutely no contribution to the message of the email, yet, will further confused the AI when trying to find food.

However, in the end, with enough manipulation, I was able to filter enough relevant information to the AI to allow for it to make predictions.

### Node/Express.js API Backend

To connect the user from the front end to the AI and their email, I used an Express.js API. I had built many apps using this framework in the past and all technologies that I needed to use were already built to work seamlessly. So, with some experimentation to get the authentication with the Gmail API working, I quickly built an app to query a users email, parse it through the AI, and then send the results back to the front-end.

### React.js with Redux, React-Native, and Flutter Frontend

React is an amazing framework. I'm very thankful to the brilliant engineers that created it. It makes developing a web app virtually painless. And, combined with React-Native, it makes mobile development on IOS and Android a breeze. However, the React frontend was never supposed to be developed. My three other teammates' goal was to create a mobile app in Flutter to display the output of the entire backend. Unfortunately, they lacked the time to learn the framework before the hackathon and failed miserably when crunch time came. During the final hours of development, they were nowhere near close to completion. So, I took it upon myself to build a React frontend (which you can see in the image above) quickly in order to show the judges something.

In addition, with a few hours left, I attempted to quickly create a React-Native mobile app. However, with so few minutes to spare, I didn't create anything that would pass as presentable.

### Thoughts

Once, when I was very young, in my third or fourth-grade science class, I remember having a group questionnaire competition. The teacher sectioned us off into groups and we all voted to elect a leader that would announce our collective answer.

I voted against being elected the leader because what seven year old isn't afraid of talking in front of the class?

Over the course of the game, I always had the right answer. I'd say 'No no no, this is the correct answer.' But, my group never cared and the leader continuously announced the wrong answer. It got to a point where I knew I was right but I thought they were systematically excluding my answer because I wasn't apart of their circle of friends. After a while, I actually got so upset that I began to cry and completely quit the game!

But, the teacher did something I wasn't expecting. Instead of comforting me and giving me a candy anyways, he said:

> Maybe you should have spoken up and became the leader of your group.

Boy did that piss me off. I felt even worse than before. And further, until the end of the game, I only received a few candies while the other teams seemed to have handfuls.

However, it wasn't until much later that I fully grasped the message the teacher was trying to tell me. The lesson was that if I want change, I can't rely on anyone else to give it to me. I have to make the change myself. That doesn't mean that I shouldn't work on a team, but, if I want my voice to be heard, I cannot rely on another leader to take my voice into consideration; I have to become the leader I want to be lead by.

During the Hackathon, I took the lead. I made things happen. I solely built the AI because I put in the effort to see it done. I wanted to create something awesome. I tried to help my other teammates in whatever way I could, but, sometimes, and inevitably, your team will let you down no matter what you do.

In conclusion, I learned that being a leader is hard. But, if you think you're being a good leader and you are working too hard, your team probably just sucks.