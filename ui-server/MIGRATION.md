# Migration Archi V3
- Mise à jour de Spring Cloud Greenwich en version SR5 et Spring Boot en version 2.1.12
- Mise à jour des plugins Gradle
   * id "org.springframework.boot" version "2.1.12.RELEASE"
   * id "io.spring.dependency-management" version "1.0.9.RELEASE"
   * id "com.google.cloud.tools.jib" version "2.2.0"
- Suppression des paramètres mémoire de la jvm lors de la construction de l'image docker par jib (géré maintenant directement par une variable d'environnement)
```
	container {
		useCurrentTimestamp = true
        jvmFlags = ['-Xms512m','-Xmx512m']
	}
```
=>
```
		container {
			creationTime = 'USE_CURRENT_TIMESTAMP'
		}
```
- Modification du fichier de déploiement kubernetes de UI

