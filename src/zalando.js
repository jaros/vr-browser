import * as $ from "jquery";

export function queryCategory(category, color, onSucess) {
  $.ajax({
        url: `https://api.zalando.com/articles?${color != null ? `color=${color}&` : "" }category=mens-${category}&page=1&pageSize=50`,
        crossDomain: true,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
        success: function (result) {
            onSucess(result);
        }
    })
}