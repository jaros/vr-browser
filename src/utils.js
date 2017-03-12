export function renderItem(items) {
    items.append('div')
        .attr('class', 'item-title')
        .html(function (d) {
            return d.name;
        });

    items.append('img')
        .attr('class', 'item-body')
        .attr("src", function (d) {
            return d.image;
        });
}

export function renderLabel(labels) {
    labels.append('div')
        .attr('class', 'item-body')
        .html(function (d) {
            return d.text;
        });
}

export function renderImage(images) {
    images.append('img')
        .attr('class', 'item-image')
        .attr("src", function (d) {
            return d.url
        });
}

export function renderButton(buttons) {
    buttons.append('input')
        .attr('type', 'button')
        .attr('class', 'item-button')
        .attr('value', 'Buy');
}

export function renderAttributes(images) {
    let list = images.append('ul').attr('class', 'item-attributes');

    list.append("li").html(function (d) {
        return d.attributes[0].name + ": " + d.attributes[0].value;
    });
    list.append("li").html(function (d) {
        return d.attributes[1].name + ": " + d.attributes[1].value;
    });
}