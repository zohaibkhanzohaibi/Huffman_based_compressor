document.getElementById('text-encoding-button').addEventListener('click', function() {
    document.getElementById('text-layout').style.display = 'block';
    document.getElementById('file-layout').style.display = 'none';
    document.getElementById('image-layout').style.display = 'none';
});

document.getElementById('file-upload-button').addEventListener('click', function() {
    document.getElementById('text-layout').style.display = 'none';
    document.getElementById('file-layout').style.display = 'block';
    document.getElementById('image-layout').style.display = 'none';
});

document.getElementById('image-compression-button').addEventListener('click', function() {
    document.getElementById('text-layout').style.display = 'none';
    document.getElementById('file-layout').style.display = 'none';
    document.getElementById('image-layout').style.display = 'block';
});
