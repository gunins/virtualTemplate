import {templateParser} from '../../src/parser/templateParser';
import {templateRenderer} from '../../src/parser/templateRenderer';
import {expect} from 'chai';



describe('test for flattening dom Nodes', () => {

    it('test Dom Parser', () => {

        var htmlTagRe = /<\/?[\w\s={}&\\"/.':;#-\/\?]+>/gi;
        const html = `<div class="content-view"><div class={oo}"one second" aria-autocomplete="list" ><span data-id={uu} data-test={bb} data-var={aa} ></span><span data-title={ff} ></span>
        <div class="inner js-post" 
        data-post={ab.bb.0.c} 
        data-post-template="two-columns-gallery">
            <div class="box-breadcrumb">
                <div class="box-left">
                    <strong class="parent"><a href="/blog/">Magazine</a></strong> for designers and web developers {{inText}}
                </div>
                <div class="box-right">

                    <div class="box-users-likes">
                        <ul class="list-users">
                            {#list}
                            <li>
                                <div class="item js-user" data-username="jnash33">
                                    <a href="/jnash33/">
                                    {#vasja}
                                        <img src="https://assets.awwwards.com/bundles/tvweb/images/nophoto.png"
                                             data-src="https://assets.awwwards.com/awards/media/cache/thumb_user_70/default/user2.jpg"
                                             width="34" height="34" alt="jnash33"
                                             class="lazy" data-caption={caption}/></a>
                                             {{item}}
                                     {/vasja}
                                </div>
                            </li>
                            {/list}

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
</div>`;

        console.log(Date.now());
        const {template, bindings} = templateParser(html);
        // console.log(template);
        // console.log(JSON.stringify(bindings, null, 4));
        console.log(Date.now());
        const data = {
            oo:   'ooBinding',
            uu:   'uuBinding',
            bb:   'bbBinding',
            aa:   'aaBinding',
            ff:   'ffBinding',
            inText:'inTextBinding',
            ab:   {bb: [{c: 'test in array'}]},
            list: {vasja: {item: 'itemBinding', caption: 'captionBinding'}}
        };
        const {render} = templateRenderer({template,bindings});
        console.log(render(data));
        console.log(Date.now());


    })

});