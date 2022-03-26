import { Member, MemberProps } from "./Member"

/**
 * @todo Read members from json file
 */

const MEMBERS: MemberProps[] = [{
    name: 'Tinfoil Realist',
    image: '/images/team/TinfoilRealist.png',
    twitterUrl: 'https://twitter.com/TinFoilRealist'
}, {
    name: 'True Voodoo',
    image: '/images/team/TrueVoodoo.png',
    twitterUrl: 'https://www.twitter.com/_TrueVoodoo'
}, {
    name: 'Plot Twist',
    image: '/images/team/PlotTwist.png',
    twitterUrl: 'https://www.twitter.com/PlotTwistFTM'
}, {
    name: 'Dracula Presley',
    image: '/images/team/DraculaPresley.png',
    twitterUrl: 'https://www.twitter.com/Draculapresley'
}];

export const Team: React.FC = () => {
    return (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {MEMBERS.map((props, index) => (
                <Member key={index} {...props} />
            ))}
        </div>
    )
}