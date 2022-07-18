

export default function Share() {
    const title = encodeURIComponent(document.title);
    const url = encodeURIComponent(window.location.href);

    const githubUrl = 'https://github.com/jackmead515/blog';
    const linkedinUrl = `https://linkedin.com/shareArticle?url=${url}&title=${title}`;
    const twitterUrl = `https://twitter.com/home?status=${title}+${url}`;
    const redditUrl = `https://www.reddit.com/submit?url=${url}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}`;

    return (
        <div className="share">
                <a
                    className="share__twitter"
                    href={twitterUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    alt='Share on Twitter'>
                    Twitter
                </a>
                <a
                    className="share__reddit"
                    href={redditUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    alt='Share on Reddit'>
                    Reddit
                </a>
                <a
                    className="share__github"
                    href={githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    alt='Share on Reddit'>
                    Github
                </a>
                <a
                    className="share__facebook"
                    href={facebookUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    alt='Share on Facebook'>
                Facebook
                </a>
                <a
                    className="share__linkedin"
                    href={linkedinUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    alt='Share on Linkedin'>
                    Linkedin
                </a>
        </div>
    )
}