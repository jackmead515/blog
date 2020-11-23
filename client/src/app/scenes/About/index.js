import React, { Component } from 'react';

import Renderer from '../../components/Renderer';

import Navigation from '../Navigation';
import Footer from '../Footer';

import { getBaseUrl } from '../../../config';

const aboutBlog = Renderer.build([
  {
    'type': 'center',
    'contents': [
      {
        'type': 'image',
        'props': {
          'width': 250,
          'source': 'image/profileimage.jpg',
        },
      },
    ],
  },
  {
    'type': 'p',
    'contents': 'Hello and welcome!',
  },
  {
    'type': 'p',
    'contents': 'My name is Jack Mead. I am a software engineer. I love systems development. Love web development. Mostly back-end stuff like big data infrastructure design. But I can definitely do front-end as well (I built this entire blog from stratch). Currently, I\'m getting really into data science and artifical intelligence.',
  },
  {
    'type': 'p',
    'contents': 'I\'ve used and built collision detection using SAT, re-enforcement neural networks, quad-tree optimization, really boring 2D games from scratch, convolutional neural networks for image recognition, a text-based encryption algorithm, data ingestion pipelines  (locally and in the cloud), complex API\'s communicating with databases and other API\'s, a timeseries database, this blog (A React/Node based web application), and many many more.',
  },
  {
    'type': 'p',
    'props': {
      'embed': true,
    },
    'contents': 'Here is just a subset of the tools/libraries/languages/frameworks (etc.) I\'ve worked with and made projects with: <b>Node.js (6-10), Javascript, Python (2-3), Java, Rust, C, React, React-Native, Sass, D3.js, Chart.js, Express.js, Hapi.js, Spring, Raspberry Pi, Arduino, Keras, Numpy, Matplotlib, Pandas, Tensorflow, SciKitLearn, Cloudwatch, Dynamo, EC2, ECS, ElasticBeanstalk, RDS, Lambda, Kinesis, SQS, SNS, Terraform, Drone, Jenkins, Cloudformation, S3.</b>',
  },
  {
    'type': 'p',
    'contents': 'Feel free to check out my github and fork any projects you find interesting.',
  },
  {
    'type': 'a',
    'props': {
      'target': 'tab',
      'href': 'https://github.com/jackmead515',
    },
    'contents': 'Github Home page',
  },
  {
    'type': 'p',
    'contents': 'So far in my career, I\'ve volunteered multiple times, run booths at science fairs, did one painful hackathon, worked for a start up, a genetics laboratory, and a fortune 500 company. Almost all of my work has been in the agriculture industry, working on developing big data applications to ingest millions of sensor readings ranging from images, geolocations, and power statistics. And I think that\'s pretty fitting as I\'ve lived in the heart of Iowa for all my life.',
  },
  {
    'type': 'p',
    'props': {
      'embed': true,
    },
    'contents': '<h3>What is this blog about?</h3>',
  },
  {
    'type': 'p',
    'contents': 'First a foremost, this blog is for me and me alone. I use it while I go on my wild adventures to the suburbs of Havana, Cuba, to being blown away by Hurricane Irma in Old Town, San Juan, Puerto Rico, to writing down my learning path discovering how to work with artifical intelligence, building electronics and messing around with a Raspberry Pi, and messing around with math and graphics developing really boring computer games.',
  },
  {
    'type': 'p',
    'contents': 'That being said, if you happen to find any of my content valuable to your learning path, I\'ve built my blog so that you can learn right along with me. I love to answer questions too. It helps me to learn! So I\'ve also made it painless for you to contact me or comment on any of my blogs if you have questions that need answering.',
  },
  {
    'type': 'p',
    'props': {
      'embed': true,
    },
    'contents': '<h3>Am I smart? Are you smart?</h3>',
  },
  {
    'type': 'p',
    'contents': 'At the time of writing this, I am 23 years old. I am a soon to be published scientific author, college drop out, and I work at a fortune 500 company making fairly decent money. Considering all this, I am far from a genius. I hate descriptors like \'intelligent\' or \'smart\'. I frequently feel insecure about my intelligence and my ability to learn. There are very few people that are geniuses, and, everyone knows them by name. Some friends I have made in the past used to say, \'Your a genius, man\'. But really, I think it was just my determination to learn and do a job right that made it seem so. Those who give up early or don\'t fail often enough will never learn and build cool things. The reality is that all the blog posts I have on my site are extremely hard materials for me and took me weeks/months to learn. So, no, I am not a genius. I am not that smart. I just really like building cool things and will spend a long time failing, learning, and doing it right.',
  },
  {
    'type': 'p',
    'contents': 'In fact, I\'m mostly a fraud! I\'ve hardly ever built something creatively without the help of textbooks, other blogs, or clear documentation and examples. I actually have a small library full of textbooks I\'ve read to learn about what I do. For fun, here is a list of books in my library that I recommend.',
  },
  {
    'type': 'remote',
    'source': `${getBaseUrl()}/lists/books`,
  },
  {
    'type': 'p',
    'contents': 'Heck, when it comes to reading I\'m not even that good! All these books I\'ve listed are extremely easy on the math and just give programming examples or simple mathematics to explain it. I don\'t own any books containing obscure mathematical algorithms and fancy language. I like my reading to be done in plain and simple english.',
  },
]);

export default class About extends Component {
  render() {
    return (
      <>
        <Navigation/>
        <div className="padded_container">
          <div className="blog_container" style={{ marginTop: 0 }}>
            <div className="blog_content">
              {aboutBlog}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}
