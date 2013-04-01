'use strict';

var ImageDetailsView = Backbone.View.extend({
    template: Handlebars.compile($('#body-content-template').html()),
    events: {
        'change #img-title': 'updateTitle',
        'change #img-url': 'updateURL',
        'click #destroy': 'destroy'
    },
    initialize: function () {
        this.model.on('change:selectedimage', this.render, this);
    },
    render: function () {
        var selectedImage = this.model.get('selectedimage');
        var html = this.template(selectedImage ? selectedImage.toJSON() : {});
        this.$el.html(html);
        return this;
    },
    updateTitle: function (event) {
        this.model.performOnSelectedImage(function (image) {
            image.set('title', event.target.value);
        });
    },
    updateURL: function (event) {
        var target = event.target;
        if (target.validity.valid) {
            this.model.performOnSelectedImage(function (image) {
                image.save('url', target.value);
            });
        }
    },
    destroy: function (event) {
        this.model.destroySelectedImage();
    }
});

var ImageModel = Backbone.Model.extend({});

var ImageCollection = Backbone.Collection.extend({
    model: ImageModel,
    localStorage: new Backbone.LocalStorage("ImageCollection"),
    newImageFromURL: function (url) {
        this.create({
            url: url,
            title: _.uniqueId('Untitled '),
            note: ''
        })
    }
});

var ImageListEntryView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click': 'setCurrentImageDetails'
    },
    template: Handlebars.compile($('#image-list-entry-view-template').html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()))
        return this;
    },
    setCurrentImageDetails: function () {
        theSelectedImageModel.set('selectedimage', this.model);
    }
});
var ImageListView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function () {
        this.model.on('change add remove', this.render, this);
    },
    render: function () {
        // XXX: this doesn't scale. We need more structure: we need to be
        // able to:
        // - add/remove elements from the <ul> when the collection gets
        // items added or removed.
        // - tell individual elements <li>'s to rerender if only their
        // contents have chaged.
        // The theme is basically to only make the DOM changes that are
        // necessary. Need to build that idea into the heart; use of
        // templating is the first step that fails.
        this.$el.empty();
        this.model.each(function (imageEntry) {
            this.$el.append(new ImageListEntryView({ model: imageEntry}).render().el);
        }, this);
    }
});


var trialCollection = new ImageCollection();
trialCollection.fetch();
if (trialCollection.size() === 0) {
    trialCollection.create({
        url: 'http://catpictures.us/images/gallery/uploads_big/cat/catpicture-514.jpg',
        title: 'a fat ginger cat',
        notes: 'It sits on a step.'
    });
    trialCollection.create({
        url: 'http://i242.photobucket.com/albums/ff271/danknuggs/Groundhog1.jpg',
        title: 'a fat groundhog',
        notes: 'It looks pyramidal.'
    });
}

var SelectedImageModel = Backbone.Model.extend({
    initialize: function () {
        this.set('selectedimage', trialCollection.at(0))
    },
    destroySelectedImage: function () {
        this.get('selectedimage').destroy();
        if (this.get('collection').size() > 0) {
            this.set('selectedimage', this.get('collection').at(0));
        } else {
            this.set('selectedimage', null);
        }
    },
    performOnSelectedImage: function (f) {
        var selectedImage = this.get('selectedimage');
        if (selectedImage !== null) {
            f(selectedImage);
        }
    }
});

var theSelectedImageModel = new SelectedImageModel({
    collection: trialCollection
});

var singleton = new ImageDetailsView({
    model: theSelectedImageModel,
    el: $('#body-content')
});
singleton.render()

var imageList = new ImageListView({
    el: $('#image-list'),
    model: trialCollection
});
imageList.render();

var CreateNewImageView = Backbone.View.extend({
    events: {
        'submit': 'addImageToCollection'
    },
    addImageToCollection: function (event) {
        var urlEntry = this.el.querySelector('#url-entry');
        trialCollection.newImageFromURL(urlEntry.value);
        urlEntry.value = '';
        event.preventDefault()
    }
});

var createNewImageView = new CreateNewImageView({
    el: $('#inputform')
});


