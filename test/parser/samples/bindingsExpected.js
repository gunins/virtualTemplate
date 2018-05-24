const bindingsExpected = [
    {
        "uid":         "block_0_0",
        "bindingType": "block",
        "tag":         "<div id=\"block_0_0\"></div>",
        "blockName":   "lista",
        "children":    {
            "template": "\n                            <div>  \n                            <li id=\"block_1_0\"></li>\n                            </div>\n                            ",
            "bindings": [
                {
                    "uid":         "block_1_0",
                    "bindingType": "block",
                    "tag":         "<li id=\"block_1_0\"></li>",
                    "blockName":   "listb",
                    "children":    {
                        "template": "\n                            <li>\n                                <div id=\"block_2_0\"></div>\n                            </li>\n                            ",
                        "bindings": [
                            {
                                "uid":         "block_2_0",
                                "bindingType": "block",
                                "tag":         "<div id=\"block_2_0\"></div>",
                                "blockName":   "listc",
                                "children":    {
                                    "template": "\n                                    <div class=\"item js-user\" data-username=\"jnash33\">\n                                        <a id=\"tag_3_0\" href=\"/jnash33/\" >\n                                            <img src=\"https://assets.awwwards.com/bundles/tvweb/images/nophoto.png\"\n                                                 data-src=\"https://assets.awwwards.com/awards/media/cache/thumb_user_70/default/user2.jpg\"\n                                                 width=\"34\" height=\"34\" alt=\"jnash33\"\n                                                 class=\"lazy\" />\n                                         </a>\n                                         <span id=\"text_4_1\"></span>\n                                       \n                                    </div>\n                                 ",
                                    "bindings": [
                                        {
                                            "uid":         "tag_3_0",
                                            "bindingType": "attribute",
                                            "tag":         "<a id=\"tag_3_0\" href=\"/jnash33/\" >",
                                            "attributes":  [
                                                {
                                                    "attribute": "data-caption",
                                                    "binding":   "caption",
                                                    "path":      "data-caption={caption}"
                                                }
                                            ]
                                        },
                                        {
                                            "uid":         "text_4_1",
                                            "bindingType": "text",
                                            "tag":         "<span id=\"text_4_1\"></span>",
                                            "binding":     "item"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "uid":         "tag_5_1",
        "bindingType": "attribute",
        "tag":         "<div id=\"tag_5_1\" class=\"content-view\">",
        "attributes":  [
            {
                "attribute": "class",
                "value":     "\"content-view\"",
                "binding":   "oo",
                "path":      "class={oo}\"content-view\""
            }
        ]
    },
    {
        "uid":         "tag_6_2",
        "bindingType": "attribute",
        "tag":         "<div id=\"tag_6_2\" class=\"one second\" aria-autocomplete=\"list\" >",
        "attributes":  [
            {
                "attribute": "class",
                "value":     "\"one second\"",
                "binding":   "oo",
                "path":      "class={oo}\"one second\""
            }
        ]
    },
    {
        "uid":         "tag_7_3",
        "bindingType": "attribute",
        "tag":         "<span id=\"tag_7_3\" >",
        "attributes":  [
            {
                "attribute": "data-id",
                "binding":   "uu",
                "path":      "data-id={uu}"
            },
            {
                "attribute": "data-test",
                "binding":   "bb",
                "path":      "data-test={bb}"
            },
            {
                "attribute": "data-var",
                "binding":   "aa",
                "path":      "data-var={aa}"
            }
        ]
    },
    {
        "uid":         "tag_8_4",
        "bindingType": "attribute",
        "tag":         "<span id=\"tag_8_4\" >",
        "attributes":  [
            {
                "attribute": "data-title",
                "binding":   "ff",
                "path":      "data-title={ff}"
            }
        ]
    },
    {
        "uid":         "tag_9_5",
        "bindingType": "attribute",
        "tag":         "<div id=\"tag_9_5\" class=\"inner js-post\" data-post-template=\"two-columns-gallery\">",
        "attributes":  [
            {
                "attribute": "data-post",
                "binding":   "ab.bb.0.c",
                "path":      "data-post={ab.bb.0.c}"
            }
        ]
    },
    {
        "uid":         "text_10_6",
        "bindingType": "text",
        "tag":         "<span id=\"text_10_6\"></span>",
        "binding":     "inText"
    }
];

const updated = [
    {
        path: 'lista.0',
        uid:  'template_12_2',
        type: 'block'
    },
    {
        path: 'lista.listb.0',
        uid:  'template_13_3',
        type: 'block'
    },
    {
        path: 'lista.listb.listc.0',
        uid:  'template_14_4',
        type: 'block'
    },
    {
        path:  'lista.listb.listc.0.caption',
        value: 'captionBinding1',
        uid:   'tag_3_0',
        type:  'data-caption'
    },
    {
        path:  'lista.listb.listc.0.item',
        value: 'itemBinding1',
        uid:   'text_4_1',
        type:  'text'
    },
    {
        path: 'lista.listb.listc.1',
        uid:  'template_15_5',
        type: 'block'
    },
    {
        path:  'lista.listb.listc.1.caption',
        value: 'captionBinding2',
        uid:   'tag_3_0',
        type:  'data-caption'
    },
    {
        path:  'lista.listb.listc.1.item',
        value: 'itemBinding2',
        uid:   'text_4_1',
        type:  'text'
    },
    {
        path: 'lista.listb.listc.2',
        uid:  'template_16_6',
        type: 'block'
    },
    {
        path:  'lista.listb.listc.2.caption',
        value: 'captionBinding3',
        uid:   'tag_3_0',
        type:  'data-caption'
    },
    {
        path:  'lista.listb.listc.2.item',
        value: 'itemBinding3',
        uid:   'text_4_1',
        type:  'text'
    },
    {
        value: 'ooBinding',
        uid:   'tag_6_2',
        type:  'class',
        path:  'oo'
    },
    {
        value: 'uuBinding',
        uid:   'tag_7_3',
        type:  'data-id',
        path:  'uu'
    },
    {
        value: 'bbBinding',
        uid:   'tag_7_3',
        type:  'data-test',
        path:  'bb'
    },
    {
        value: 'aaBinding',
        uid:   'tag_7_3',
        type:  'data-var',
        path:  'aa'
    },
    {
        value: 'ffBinding',
        uid:   'tag_8_4',
        type:  'data-title',
        path:  'ff'
    },
    {
        value: 'test in array',
        uid:   'tag_9_5',
        type:  'data-post',
        path:  'ab.bb.0.c'
    },
    {
        value: 'inTextBinding',
        uid:   'text_10_6',
        type:  'text',
        path:  'inText'
    },
    {
        value: 'ooBinding',
        uid:   'template_11_1',
        type:  'class',
        path:  'oo'
    }
];

export {bindingsExpected, updated}