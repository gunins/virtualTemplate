import {expect} from 'chai';
import DomParser from 'dom-parser';
const parser = new DomParser();
describe('test for flattening dom Nodes', () => {

    it('test Dom Parser', () => {

        const html =`<div class="content-view">
    <div class="block pt-0">
        <div class="inner js-post"
             data-post="{&quot;likes&quot;:1,&quot;id&quot;:259,&quot;slug&quot;:&quot;50-examples-of-responsive-web-design&quot;,&quot;images&quot;:{&quot;thumbnail&quot;:&quot;images\\/2013\\/01\\/responsive-sites.jpg&quot;},&quot;type&quot;:&quot;post&quot;}"
             data-post-template="two-columns-gallery">
            <div class="box-breadcrumb">
                <div class="box-left">
                    <strong class="parent"><a href="/blog/">Magazine</a></strong> for designers and web developers
                </div>
                <div class="box-right">

                    <div class="box-users-likes">
                        <ul class="list-users">

                            <li>
                                <div class="item js-user" data-username="jnash33">
                                    <a href="/jnash33/">
                                        <img src="https://assets.awwwards.com/bundles/tvweb/images/nophoto.png"
                                             data-src="https://assets.awwwards.com/awards/media/cache/thumb_user_70/default/user2.jpg"
                                             width="34" height="34" alt="jnash33"
                                             class="lazy"/></a>
                                </div>
                            </li>

                        </ul>

                        <span class="bt-item bt-default bt-likeit js-bt-like js-collect-like ">
                    <svg class="ico-svg" viewbox="0 0 15 14" xmlns="http://www.w3.org/2000/svg">
        <use xlink:href="/bundles/tvweb/images/sprite-icons.svg#heart" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
    </svg>

        <span class="number">
                            01
                    </span>
    </span>
                        <strong class="bt-item bt-default js-collect">Collect</strong>

                    </div>

                </div>
            </div>
        </div>
    </div>
</div>`
        const dom = parser.parseFromString(html,'text/html');
        console.log(dom);


    })

});