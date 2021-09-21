file=/config/config.yml

if [[ ! -f "$file" ]]; then
    cp ./config.sample.yml /config/config.yml
fi

ts-node ./index.ts