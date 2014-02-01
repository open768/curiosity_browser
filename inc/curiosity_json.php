<?php
require_once("inc/cached_http.php");

class cCuriosity{
	const SOL_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/images_sol";
	const FEED_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json";

	//*****************************************************************************
	public function getSolData($psSol){
		$url=cCuriosity::SOL_URL."${psSol}.json";
		?>
			<h1>URL</h1>
				<a href="<?=$url?>" target="src"><?=$url?></a>
		<?php
		return cCachedHttp::getCachedJson($url);
	}
}
?>