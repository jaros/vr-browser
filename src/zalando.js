import * as $ from "jquery";

export function queryCategory(category, color, onSuccess) {
  $.ajax({
        url: `https://api.zalando.com/articles?${color != null ? `color=${color}&` : "" }category=mens-${category}&page=1&pageSize=50`,
        crossDomain: true,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
        success: function (result) {
            onSuccess(result.content.map(function (d) {
              return {
                image: d.media.images[0].mediumUrl,
                season: d.season,
                name: d.name,
                color: d.color,
                type: "item"
              }
            }));
        }
    })
}

export function transformArticle(d) {
  return [{
      type: "image",
      url: d.image
    }, {
      type: "label",
      text: d.name
    }, {
      type: "button"
    }, {
      type: "attributes",
      attributes: [ {
        name: "Color",
        value: d.color
      }, {
        name: "Season",
        value: d.season
      }]
    }
  ]
}