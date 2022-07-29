const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const v1 = JSON.parse(readFileSync(join(__dirname, '..', 'public', 'config', 'project-base-information.json'), { encoding: 'utf8' }));

const done = [];
const v2 = []

v1.forEach(project => {

    const id = project.id;
    if (!id) {
        throw new Error(`No id for ${project.name}`);
    }

    if (done.includes(id)) {
        return;
    }

    const projects = v1.filter(project => project.id === id);
    const firstProject = projects[0];

    const newItem = {
        id: firstProject.id,
        chains: {},
        coverImage: firstProject.coverImage,
        releaseDate: firstProject.releaseDate,
        artistId: firstProject.artistId,
        description: firstProject.description,
        images: [],
        name: firstProject.name,
        symbol: firstProject.symbol,
        attributions: firstProject.attributions,
        crossChainType: 'none',
        hideInProjects: firstProject.hideInProjects,
        loreAudio: firstProject.loreAudio,
        mutate: firstProject.mutate,
        overrideIpfsGateway: firstProject.overrideIpfsGateway,
        roadmapImage: firstProject.roadmapImage,
        secondaryMarketplace: firstProject.secondaryMarketplace,
        whitelistDate: firstProject.whitelistDate
    }

    projects.forEach(project => {
        newItem.chains[project.network] = {
            contractAddress: project.contractAddress,
            initialSupply: project.maxSupply,
            externalMintLocation: project.externalMintLocation,
            mint: project.mint
        };

        newItem.images?.push(...project.images || [])
    });

    done.push(id);

    v2.push(newItem);

    console.log(newItem);
});
writeFileSync(join(__dirname, '..', 'public', 'config', 'project-base-information_new.json'), JSON.stringify(v2), { encoding: 'utf8' });
