$(function() {

    var selectedPhotoDiv = $('#photo-modal');
    selectedPhotoDiv.hide();
    var flickrSearch = $('#flickr_search');
    var clrSearch = $('#clear_search');
    clrSearch.hover(function() {
        $(this).css('cursor','pointer');
    });
    clrSearch.hide();

    clrSearch.click(function () {
        bringUserToTop();
        removePhotos();
        closeModal();
        clrSearch.hide();
    });

    var xBtn = $('#x-btn').click(function() {
        closeModal();
    });

    flickrSearch.hover(function() {
        $(this).css('cursor','pointer');
    });

    xBtn.hover(function() {
        $(this).css('cursor','pointer');
    });

    var bringUserToTop = function () {
        $('html, body').animate({
            scrollTop: 0
        }, 100);
    };

    var bringUserToModal = function () {
        $('html, body').animate({
            scrollTop: $('#photo-modal').offset().top
        }, 100);
    };
    var bringUserToImages = function () {
        $('html, body').animate({
            scrollTop: $('#fetchedImages').offset().top
        }, 100);
    };

    var closeModal = function() {
        selectedPhotoDiv.fadeOut(700);
    };
    var showModal = function(thumbnailUrl) {
        var newUrl = thumbnailUrl.replace('_t', '_z');
        $('#selected_img').attr('src', newUrl);
        selectedPhotoDiv.fadeIn(700);

    };
    var removePhotos = function() {
        $('#fetchedImages').children().remove();
    };


    var renderMarkupForFetchedPhotos = function (photos) {
        var rowId = 0;
        removePhotos(); // remove old photos in case user has searched already
        for(var i=0; i<photos.length; i++) {
            var thumbnailUrl = 'https://farm' + photos[i].farm + '.staticflickr.com/' + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret + '_t' + '.jpg';
            if(i % 4 == 0) { // creates a new row every 4 images
                $('#fetchedImages').append('<div class="row" id="' + i + '"></div>');
                rowId = i;
            }
            $('#'+ rowId + '').append('<div class="col-md-3"><img src="' + thumbnailUrl + '" class="center-block"/></div>')
                .click(function (evt) {
                    var thumbNailUrlSelectedPhoto = evt.target.src;
                    showModal(thumbNailUrlSelectedPhoto);
                    bringUserToModal();
                }).hover(function() {
                $(this).css('cursor', 'pointer');
            });
        }
        clrSearch.show();
        bringUserToImages();
    };

    var sendRequest = function() {
        var searchText = $('#flickr_query').val();
        var API_KEY = "089063c49f6c8706a04b70f8a1f2abb2";
        var requestUrl = "https://api.flickr.com/services/rest/?" + "method=flickr.photos.search&" + "&text=" + searchText + "&content_type=1" + "&safe_search=1" + "&format=json" + "&jsoncallback=?" + "&api_key=" + API_KEY;
        $.ajax({
            url: requestUrl,
            type: "GET",
            dataType: 'jsonp',
            success: function(data) {
                renderMarkupForFetchedPhotos(data.photos.photo);
            }
        });
    };

    flickrSearch.click(function(evt) {
        if ($('#flickr_query').val().length !==  0) {
            sendRequest();
        }  else {
            alert('Please type something before clicking Search!');
        }
    });
});
