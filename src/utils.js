export function renderItem(items) {
    items.append('div')
        .attr('class', 'item-title')
        .html(function (d) { return d.name; });

    items.append('img')
        .attr('class', 'item-body')
        .attr("src", function (d) { return d.image });
}

export function renderLabel(labels) {
    labels.append('div')
        .attr('class', 'item-body')
        .html(function (d) { return d.text; });
}

export function renderImage(images) {
      images.append('img')
        .attr('class', 'item-body')
        .attr("src", function (d) { return d.url });
}