
const rootStyles = window.getComputedStyle(document.documentElement)
const ready = () =>{
  console.log('ready')
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width'))
  const aspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ration')) 
  const coverHeight = coverWidth / aspectRatio; 
  
  FilePond.registerPlugin(FilePondPluginImagePreview);
  FilePond.registerPlugin(FilePondPluginImageResize);
  FilePond.registerPlugin(FilePondPluginFileEncode);
  
  FilePond.setOptions({
    stylePanelAspectRatio:1 / aspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })

  FilePond.parse(document.body);
}


if(rootStyles.getPropertyValue('--book-cover-width') != null  && rootStyles.getPropertyValue('--book-cover-width') !== ''){
  ready()
}else{
  document.getElementById('mainCss').addEventListener('load',ready)
}
