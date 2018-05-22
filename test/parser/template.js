import {templateParser} from '../../src/parser/templateParser';
import {templateRenderer} from '../../src/parser/templateRenderer';
import {flatten, diff} from '../../src/diff/Diff';
import {expect} from 'chai';


describe('test for flattening dom Nodes', () => {

    it('test Dom Parser', () => {

        const html = `<div class={oo}"content-view"><div class={oo}"one second" aria-autocomplete="list" ><span data-id={uu} data-test={bb} data-var={aa} ></span><span data-title={ff} ></span>
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
                        
                            {#lista}
                            <div>  
                            {#listb}
                            <li>
                                {#listc}
                                    <div class="item js-user" data-username="jnash33">
                                        <a href="/jnash33/" data-caption={caption}>
                                            <img src="https://assets.awwwards.com/bundles/tvweb/images/nophoto.png"
                                                 data-src="https://assets.awwwards.com/awards/media/cache/thumb_user_70/default/user2.jpg"
                                                 width="34" height="34" alt="jnash33"
                                                 class="lazy" />
                                         </a>
                                         {{item}}
                                       
                                    </div>
                                 {/listc}
                            </li>
                            {/listb}
                            </div>
                            {/lista}

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
            oo:     'ooBinding',
            uu:     'uuBinding',
            bb:     'bbBinding',
            aa:     'aaBinding',
            ff:     'ffBinding',
            inText: 'inTextBinding',
            ab:     {bb: [{c: 'test in array'}]},
            lista:   {
                listb: {

                    listc: [
                        {caption: 'captionBinding1', item: 'itemBinding1'},
                        {caption: 'captionBinding2', item: 'itemBinding2'},
                        {caption: 'captionBinding3', item: 'itemBinding3'}
                    ]
                }
            }
        };
        const {add} = diff(flatten(data));
        const {template: after, rendered} = templateRenderer({template, bindings}, add);
        console.log(after);
        console.log(rendered);
        console.log(Date.now());


    })

});