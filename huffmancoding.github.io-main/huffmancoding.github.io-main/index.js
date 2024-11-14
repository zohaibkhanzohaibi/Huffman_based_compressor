document.getElementById('text-encoding-button').addEventListener('click', function() {
    document.getElementById('text-layout').style.display = 'block';
    document.getElementById('file-layout').style.display = 'none';
    document.getElementById('image-layout').style.display = 'none';
    document.getElementById('nav-layout').style.display = 'none';
});

document.getElementById('text-encode-button').addEventListener('click', function() {
    document.getElementById('encoded-text').style.display = 'block';    
    document.getElementById('encoded-codes').style.display = 'block';    

});

document.getElementById('file-upload-button').addEventListener('click', function() {
    document.getElementById('text-layout').style.display = 'none';
    document.getElementById('file-layout').style.display = 'block';
    document.getElementById('image-layout').style.display = 'none';
    document.getElementById('nav-layout').style.display = 'none';
    document.getElementById('file-decode-button').style.display = 'block';
});

document.getElementById('image-compression-button').addEventListener('click', function() {
    document.getElementById('text-layout').style.display = 'none';
    document.getElementById('file-layout').style.display = 'none';
    document.getElementById('image-layout').style.display = 'block';
    document.getElementById('nav-layout').style.display = 'none';
});

document.getElementById('file-encode-button').addEventListener('click', function() {
    document.getElementById('download-encoded-file').style.display = 'block';
    document.getElementById('compression-ratio').style.display = 'block';
    document.getElementById('download-decoded-file').style.display = 'none';
});

document.getElementById('file-decode-button').addEventListener('click', function() {
    ocument.getElementById('download-encoded-file').style.display = 'none';
    document.getElementById('compression-ratio').style.display = 'none';
    document.getElementById('download-decoded-file').style.display = 'block';
});

document.getElementById('image-encode-button').addEventListener('click', function() {
    document.getElementById('download-encoded-image').style.display = 'block';
    document.getElementById('image-compression-ratio').style.display = 'block';
    
});